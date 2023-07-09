import React from "react";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import { IconButton, Tooltip } from "@mui/material";
import { getRandomColor } from "../../../utils/colorUtils";

interface InputColorFormItemProps {
    setColor: (value: string) => void;
    color: string;
    className?: string;
}

export default function InputColor(props: InputColorFormItemProps) {
    return (
        <>
            <input
                type="color"
                value={props.color}
                onChange={(e) => props.setColor(e.target.value)}
                className={props.className}
            />

            <Tooltip title="Случайный цвет">
                <IconButton onClick={() => props.setColor(getRandomColor())}>
                    <ShuffleOnIcon color="primary" />
                </IconButton>
            </Tooltip>
        </>
    );
}
