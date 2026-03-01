import { Button as BaseButton } from "@base-ui/react/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, useState } from "react";

import { TextInput } from "./text-input";

export const PasswordInput = (props: ComponentPropsWithoutRef<typeof TextInput>) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      {...props}
      type={visible ? "text" : "password"}
      rightSection={
        <BaseButton
          onClick={() => setVisible(!visible)}
          className="rounded-md p-1 hover:bg-white/5 transition-colors focus:outline-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </BaseButton>
      }
    />
  );
};
