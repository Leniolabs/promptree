import React from "react";
import { Button } from "../../buttons/Button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../layout/Modal";
import { ISettings } from "@/store";
import { TextInput } from "@/components/inputs/TextInput";
import { Label } from "@/components/displays/Label";

interface SettingsModalProps {
  initialSettings: ISettings;
  onSave?: (settings: ISettings) => void;
  onCancel?: () => void;
}

export function SettingsModal(props: SettingsModalProps) {
  const [settings, setSettings] = React.useState(props.initialSettings);

  const handleSave = React.useCallback(() => {
    props.onSave?.(settings);
  }, [settings, props.onSave]);

  return (
    <Modal size="md">
      <ModalHeader title="Settings" onClose={props.onCancel} />
      <ModalContent>
        <Label>
          OpenAI API KEY{" "}
          <a
            target="_blank"
            href="https://platform.openai.com/account/api-keys"
          >
            Get your api key
          </a>
        </Label>
        <TextInput
          value={settings.apikey}
          onChange={(apikey) =>
            setSettings((settings) => ({ ...settings, apikey }))
          }
          placeholder="Enter your OpenAI api key"
        />
      </ModalContent>
      <ModalFooter>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}
