import React, { ChangeEvent, ReactNode, useState } from "react";
import Controller from "../base/Controller";
import { INoteConfigItem } from "../view/SettingView";

export default function DailyNotePattern({
  value,
  onChange,
  title,
  subTitle,
  onBulr,
}: {
  value: string;
  onChange: (value: string) => void;
  onBulr: () => void;
  title: ReactNode;
  subTitle: ReactNode;
}) {
  const [_value, setValue] = useState(value);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <>
      <div className="setting-item-info">
        <div className="setting-item-name">{title}</div>
        <div className="setting-item-description">{subTitle}</div>
      </div>
      <div className="setting-item-control">
        <input
          type="text"
          value={_value}
          spellCheck="false"
          onChange={onInputChange}
          onBlur={onBulr}
        />
      </div>
    </>
  );
}
