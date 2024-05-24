import React, { useMemo, useState } from "react";
import { Button, Calendar, Col, Radio, Row, Select } from "antd";
import type { CalendarProps } from "antd";
import { createStyles } from "antd-style";
import classNames from "classnames";
import dayjs from "dayjs";
import type { Dayjs, ManipulateType } from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear"; // 导入插件
import * as advancedFormat from "dayjs/plugin/advancedFormat"; // 导入插件
import { HolidayUtil, Lunar } from "lunar-typescript";
import "dayjs/locale/zh-cn";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.locale("zh-CN");

const useStyle = createStyles(({ token, css, cx }) => {
  const lunar = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
  `;
  return {
    wrapper: css`
      min-width: 368px;
      border-radius: ${token.borderRadiusOuter};
      padding: 5px;
      .ant-picker-calendar {
        .ant-picker-panel {
          border: none;
        }
      }
    `,
    header: css`
      border-bottom: 1px solid rgba(5, 5, 5, 0.06);
    `,
    icon: css`
      cursor: pointer;
    `,
    flexCenter: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    headerDate: css`
      display: flex;
      font-size: 20px;
      div {
        margin: 0 2px;
        padding: 2px 4px;
        cursor: pointer;
        border-radius: ${token.borderRadiusOuter}px;
        &:hover {
          background: rgba(0, 0, 0, 0.08);
        }
      }
    `,
    content: css`
      display: flex;
    `,
    extraW: css`
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-right: 1px solid rgba(5, 5, 5, 0.06);
    `,
    extraQ: css`
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      border-right: 1px solid rgba(5, 5, 5, 0.06);
    `,
    extraWTh: css`
      line-height: 18px;
      width: 40px;
      font-size: 14px;
    `,
    extraWTd: css`
      font-weight: normal;
      margin: 6px !important;
      margin-left: 0 !important;
    `,
    extraQTd: css`
      font-weight: normal;
      margin: 6px !important;
      margin-left: 0 !important;
      flex-direction: column;
    `,
    dateCell: css`
      width: 40px;
      height: 40px;
      border-radius: ${token.borderRadiusOuter}px;
      box-sizing: border-box;
      transition: background 300ms;
      background: transparent;
      margin: 0 auto;
      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }
    `,
    lunar,
    text: css`
      position: relative;
      z-index: 1;
    `,
    today: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(lunar)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
    `,
    // current: css`
    //   color: ${token.colorTextLightSolid};
    //   background: ${token.colorPrimary};
    //   &:hover {
    //     background: ${token.colorPrimary};
    //     opacity: 0.8;
    //   }
    //   .${cx(lunar)} {
    //     color: ${token.colorTextLightSolid};
    //     opacity: 0.9;
    //   }
    // `,
    monthCell: css`
      width: 120px;
      color: ${token.colorTextBase};
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    monthCellCurrent: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
    `,
  };
});

const App: React.FC = () => {
  const { styles } = useStyle({ test: true });

  const [selectDate, setSelectDate] = React.useState<Dayjs>(dayjs());

  const [mode, setMode] = useState<CalendarProps<Dayjs>["mode"]>("year");
  const changeMode = (mode: CalendarProps<Dayjs>["mode"] & "today") => {
    if (mode === "today") {
      setSelectDate(dayjs());
      return;
    }
    setMode(mode);
  };

  // const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  //   console.log("onPanelChange", value.format("YYYY-MM-DD"), mode);
  // };

  // const onDateChange: CalendarProps<Dayjs>["onSelect"] = (
  //   value,
  //   selectInfo
  // ) => {
  //   console.log("onDateChange", value.format("YYYY-MM-DD"), selectInfo);
  //   if (selectInfo.source === "date") {
  //     setSelectDate(value);
  //   }
  // };

  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const h = HolidayUtil.getHoliday(
      date.get("year"),
      date.get("month") + 1,
      date.get("date")
    );
    const displayHoliday =
      h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
    if (info.type === "date") {
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.today]: date.isSame(dayjs(), "date"),
        }),
        children: (
          <div className={styles.text}>
            {date.get("date")}
            {info.type === "date" && (
              <div className={styles.lunar}>
                {displayHoliday || solarTerm || lunar}
              </div>
            )}
          </div>
        ),
      });
    }

    if (info.type === "month") {
      // Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
      // when rendering a month, always take X as the lunar month of the month
      const d2 = Lunar.fromDate(new Date(date.get("year"), date.get("month")));
      const month = d2.getMonthInChinese();
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: date.isSame(dayjs(), "month"),
          })}
        >
          {date.get("month") + 1}月（{month}月）
        </div>
      );
    }
  };

  const changeDate = (option: string, unit: ManipulateType) => {
    let newDate = selectDate;
    if (option === "add") {
      newDate = selectDate.add(1, unit);
    } else {
      newDate = selectDate.subtract(1, unit);
    }
    setSelectDate(newDate);
  };

  const yearLabel = useMemo(
    () => `${selectDate.format("YYYY")}年`,
    [selectDate]
  );
  const monthlabel = useMemo(
    () => `${selectDate.format("MM")}月`,
    [selectDate]
  );
  const quarterLabel = useMemo(
    () => `第${selectDate.format("Q")}季度`,
    [selectDate]
  );

  const chineseLabel = useMemo(() => {
    const year = selectDate.year();
    const month = selectDate.month();
    const d = Lunar.fromDate(new Date(year, month));
    return `${d.getYearInGanZhi()}${d.getYearShengXiao()}年${d.getMonthInChinese()}月`;
  }, [selectDate]);

  const weeksArr = useMemo(() => {
    const week = dayjs(`${selectDate.format("YYYY-MM")}-01`).week();
    return new Array(6).fill(week).map((v, idx) => v + idx);
  }, [selectDate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Row justify="end" gutter={8}>
          <Col>
            <Radio.Group
              size="small"
              onChange={(e) =>
                changeMode(
                  e.target.value as CalendarProps<Dayjs>["mode"] & "today"
                )
              }
              value={mode}
            >
              <Radio.Button value="today">今</Radio.Button>
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="year">年</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Row
          justify="center"
          style={{ margin: "4px 0" }}
          gutter={8}
          align="middle"
        >
          <Col>
            <DoubleLeftOutlined
              className={styles.icon}
              aria-label="前一年"
              title="前一年"
              onClick={() => changeDate("sub", "year")}
            />
          </Col>
          <Col>
            <LeftOutlined
              className={styles.icon}
              aria-label="前一月"
              title="前一月"
              onClick={() => changeDate("sub", "month")}
            />
          </Col>
          <Col flex="auto">
            <div className={classNames(styles.headerDate, styles.flexCenter)}>
              <div>{yearLabel}</div>
              <div>{monthlabel}</div>
              <div>{quarterLabel}</div>
            </div>
            <div className={classNames(styles.flexCenter)}>{chineseLabel}</div>
          </Col>
          <Col>
            <RightOutlined
              className={styles.icon}
              aria-label="后一月"
              title="后一月"
              onClick={() => changeDate("add", "month")}
            />
          </Col>
          <Col>
            <DoubleRightOutlined
              className={styles.icon}
              title="后一年"
              aria-label="后一年"
              onClick={() => changeDate("add", "year")}
            />
          </Col>
        </Row>
      </div>
      <div className={styles.content}>
        {mode === "month" ? (
          <div className={styles.extraW}>
            <div className={classNames(styles.extraWTh, styles.flexCenter)}>
              周
            </div>
            {weeksArr.map((v) => {
              return (
                <div
                  key={v}
                  className={classNames(
                    styles.extraWTd,
                    styles.flexCenter,
                    styles.dateCell
                  )}
                >
                  {v}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.extraQ}>
            {["一", "二", "三", "四"].map((v) => {
              return (
                <div
                  key={v}
                  className={classNames(
                    styles.extraQTd,
                    styles.flexCenter,
                    styles.dateCell
                  )}
                >
                  第{v}
                  <div className={styles.text}>季度</div>
                </div>
              );
            })}
          </div>
        )}
        <Calendar
          fullCellRender={cellRender}
          fullscreen={false}
          mode={mode}
          // onPanelChange={onPanelChange}
          // onSelect={onDateChange}
          value={selectDate}
          headerRender={({ value, type, onChange, onTypeChange }) => null}
        />
      </div>
    </div>
  );
};

export default App;
