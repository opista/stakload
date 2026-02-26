import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { ComponentPropsWithoutRef } from "react";

import { TextInput } from "./text-input";

export const PasswordInput = (props: ComponentPropsWithoutRef<typeof TextInput>) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      {...props}
      type={visible ? "text" : "password"}
      rightSection={
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="rounded-md p-1 hover:bg-white/5 transition-colors"
        >
          {visible ? <IconEyeOff size={16} /> : <IconEye size={16} />}
        </button>
      }
    />
  );
};
