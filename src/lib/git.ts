import { createFsFromVolume, IFs, Volume } from "memfs";
import { dirname } from "path";
import git, { Errors } from "isomorphic-git";
import { ICheckoutOptions, IMergeOptions, IMessage } from "@/types/chat";
import { IInstance } from "@/types/api";
import { Instance, User } from "@prisma/client";
import { APP_EMAIL } from "@/settings";

const CHAT_FILE_PATH = "/chat.json";
const ROOT_DIR = "/repository";

export class InstanceRepository {
  //@ts-ignore
  volume: Volume;
  fs: IFs;

  //@ts-ignore
  constructor(volume?: Volume) {
    if (volume) {
      //@ts-ignore
      this.volume = volume as Volume;
    } else {
      this.volume = new Volume();
    }

    this.fs = createFsFromVolume(this.volume);
  }

  async init(user?: User | null) {
    this.fs.mkdirSync(ROOT_DIR);
    this.fs.writeFileSync(ROOT_DIR + CHAT_FILE_PATH, "[]");

    await git.init({ fs: this.fs, dir: ROOT_DIR });
    await git.add({
      fs: this.fs,
      dir: ROOT_DIR,
      filepath: CHAT_FILE_PATH.slice(1),
    });
    await git.commit({
      fs: this.fs,
      dir: ROOT_DIR,
      message: "initial commit",
      author: {
        name: user?.name || "Annonymous",
        email: user?.email || APP_EMAIL,
      },
    });
  }

  async getBranchOid(branch: string) {
    return await git.resolveRef({ fs: this.fs, dir: ROOT_DIR, ref: branch });
  }

  async getBranches() {
    const branches = await git.listBranches({
      dir: ROOT_DIR,
      fs: this.fs,
    });

    return await Promise.all(
      branches.map(async (branch) => {
        const ref = `refs/heads/${branch}`;
        const hash = await git.resolveRef({
          fs: this.fs,
          dir: ROOT_DIR,
          ref,
        });
        return { branch, hash };
      })
    );
  }

  async getDifference(fromBranch: string, toBranch: string) {
    const fromOid = await this.getBranchOid(fromBranch);
    const fromMessages = await this.getMessages(fromOid);

    const toOid = await this.getBranchOid(toBranch);
    const toMessages = await this.getMessages(toOid);

    return fromMessages.filter((x) => !toMessages.find((y) => y.id === x.id));
  }

  async getMessages(commitOid?: string) {
    if (commitOid) {
      const { blob } = await git.readBlob({
        fs: this.fs,
        dir: ROOT_DIR,
        filepath: CHAT_FILE_PATH.slice(1),
        oid: commitOid,
      });

      return JSON.parse(Buffer.from(blob).toString("utf8")) as IMessage[];
    }

    const content = this.fs.readFileSync(
      ROOT_DIR + CHAT_FILE_PATH,
      "utf8"
    ) as string;
    return JSON.parse(content) as IMessage[];
  }

  async reset(commitOid: string) {
    await git.checkout({
      fs: this.fs,
      dir: ROOT_DIR,
      ref: commitOid,
      force: true,
    });
  }

  async getCommits() {
    const branches = await git.listBranches({
      dir: ROOT_DIR,
      fs: this.fs,
    });

    const commits = (
      await Promise.all(
        branches.map((branch) =>
          git.log({
            dir: ROOT_DIR,
            fs: this.fs,
            ref: branch,
          })
        )
      )
    ).flat();

    return commits
      .filter((x, i, arr) => arr.findIndex((y) => y.oid === x.oid) === i)
      .map((commit) => ({
        hash: commit.oid,
        message: commit.commit.message,
        parents: commit.commit.parent,
        timestamp: commit.commit.author.timestamp,
        tree: commit.commit.tree,
      }));
  }

  async getCurrentRef() {
    return await git.resolveRef({
      fs: this.fs,
      dir: ROOT_DIR,
      ref: "HEAD",
    });
  }

  updateChat(messages: IMessage[]) {
    this.fs.writeFileSync(ROOT_DIR + CHAT_FILE_PATH, JSON.stringify(messages));
  }

  async checkout(options: ICheckoutOptions) {
    if ("create" in options && options.create && options.branchName) {
      await git.branch({
        fs: this.fs,
        dir: ROOT_DIR,
        checkout: true,
        ref: options.branchName,
        force: true,
        object: options.startPoint || "HEAD",
      });
    }

    await git.checkout({
      fs: this.fs,
      dir: ROOT_DIR,
      ref: options?.branchName,
      force: true,
      noUpdateHead: options?.noUpdateHead,
    });

    await git.resetIndex({
      fs: this.fs,
      dir: ROOT_DIR,
      filepath: CHAT_FILE_PATH.slice(1),
    });
  }

  async merge(options: IMergeOptions, user?: User | null) {
    if (options.squashMessages) {
      this.addMessages(options.squashMessages);
    } else {
      const difference = await this.getDifference(
        options.fromBranch,
        options.toBranch
      );
      this.addMessages(difference, undefined, user);
    }

    await git.add({
      fs: this.fs,
      dir: ROOT_DIR,
      filepath: CHAT_FILE_PATH.slice(1),
    });

    await git.commit({
      fs: this.fs,
      dir: ROOT_DIR,
      message: `Merge branch '${options.fromBranch}' into '${options.toBranch}'`,
      parent: [options.toBranch, options.fromBranch],
      author: {
        name: user?.name || "Annonymous",
        email: user?.email || APP_EMAIL,
      },
    });
  }

  async editMessages(messages: IMessage[]) {
    if (messages.length) {
      const currentChat = await this.getMessages();
      const messageIndex = currentChat.findIndex(
        (x) => x.id === messages[0].id
      );

      if (messageIndex !== -1) {
        this.updateChat([...currentChat.slice(0, messageIndex), ...messages]);
      }
    }
  }

  async addMessages(
    messages: IMessage[],
    options?: { regenerate?: boolean; edit?: boolean },
    user?: User | null
  ) {
    const currentChat = await this.getMessages();
    if (options?.regenerate || options?.edit) {
      const messageIndex = currentChat.findIndex(
        (x) => x.id === messages[0].id
      );
      if (messageIndex !== -1) {
        this.updateChat([...currentChat.slice(0, messageIndex), ...messages]);
      }
    } else {
      this.updateChat([...currentChat, ...messages]);
    }

    await git.add({
      fs: this.fs,
      dir: ROOT_DIR,
      filepath: CHAT_FILE_PATH.slice(1),
    });

    const commitMessage =
      (options?.regenerate ? "Regenerated: " : "") +
      (options?.edit ? "Edit: " : "") +
      messages.map((m) => m.content).join(" ");

    await git.commit({
      fs: this.fs,
      dir: ROOT_DIR,
      message:
        commitMessage.slice(0, 48) + (commitMessage.length > 48 ? "..." : ""),
      author: {
        name: user?.name || "Annonymous",
        email: user?.email || APP_EMAIL,
      },
    });

    for (let i = 0; i < messages.length; i++)
      await git.tag({
        fs: this.fs,
        dir: ROOT_DIR,
        ref: messages[i].id,
        force: true,
      });
  }

  toJSON() {
    const binaryData = [];

    const volumeJSON = this.volume.toJSON();

    for (const path in volumeJSON) {
      if (!this.fs.lstatSync(path).isDirectory()) {
        const file = this.fs.readFileSync(path);
        binaryData.push({ path, data: file.toString("base64") });
      } else {
        binaryData.push({ path, data: null });
      }
    }
    return JSON.stringify(binaryData);
  }

  static fromJSON(json: string) {
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    const binaryData = JSON.parse(json);
    fs.mkdirSync(ROOT_DIR);
    fs.mkdirSync(ROOT_DIR + "/.git");
    fs.mkdirSync(ROOT_DIR + "/.git/objects");
    fs.mkdirSync(ROOT_DIR + "/.git/refs");
    binaryData.forEach(({ path, data }: { path: string; data: string }) => {
      if (data !== null) {
        if (!fs.existsSync(dirname(path))) {
          fs.mkdirSync(dirname(path));
        }

        fs.writeFileSync(path, Buffer.from(data, "base64"));
      } else {
        fs.mkdirSync(path);
      }
    });
    return new InstanceRepository(volume);
  }

  async serializeInstance(instance: Instance) {
    const { content, ...rest } = instance;
    //this shouldn't go here
    //but i'm lazy atm

    return {
      ...rest,
      ref: await this.getCurrentRef(),
      messages: await this.getMessages(),
      commits: await this.getCommits(),
      branches: await this.getBranches(),
    };
  }
}
