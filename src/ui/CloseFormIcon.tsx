import { useNavigate } from "react-router-dom";

export interface CloseFormIconProps {
    onClick?: (() => void) | undefined;
}

export default function CloseFormIcon(props: CloseFormIconProps) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
                if (props.onClick) {
                    props.onClick();
                } else {
                    navigate(-1);
                }
            }}
        ></button>
    );
}
