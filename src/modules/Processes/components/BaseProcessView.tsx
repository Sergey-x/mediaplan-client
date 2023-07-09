import { ProcessViewProps } from "./interfaces";
import { ViewModeEnum } from "../../../enums/viewModEnum";
import ProcessPreview from "./ProcessPreview";
import ProcessFullView from "./ProcessFullView";
import EditProcessForm from "./EditProcessForm";

interface BaseProcessViewProps extends ProcessViewProps {}

export default function BaseProcessView(props: BaseProcessViewProps) {
    if (props.viewMode === ViewModeEnum.PREVIEW || props.viewMode === undefined) {
        return <ProcessPreview {...props} />;
    } else if (props.viewMode === ViewModeEnum.FULL) {
        return <ProcessFullView {...props} />;
    } else if (props.viewMode === ViewModeEnum.EDIT) {
        return <EditProcessForm {...props} />;
    }
    return null;
}
