import { makeUnitLinkById } from "../../../routes/paths";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import Link from "@mui/material/Link";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UnitResponseItemSchema } from "../../../api/schemas/responses/units";

interface UnitLinkProps {
    unit: UnitResponseItemSchema;
}

export default function UnitLink(props: UnitLinkProps) {
    const navigate = useNavigate();

    const navPath: string = makeUnitLinkById(props.unit.id);
    return (
        <>
            <Typography variant="body1" component="p" sx={{ display: "flex" }}>
                <Link
                    href={navPath}
                    component="a"
                    variant="body2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(navPath);
                    }}
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    <IconButton sx={{ p: 0, pr: 1, color: props.unit.color || "grey" }}>
                        <PeopleIcon />
                    </IconButton>
                    <Typography sx={{ fontSize: "0.9rem", color: props.unit.color || "grey" }} component="span">
                        {props.unit.name}
                    </Typography>
                </Link>
            </Typography>
        </>
    );
}
