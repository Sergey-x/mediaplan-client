import { UnitActionsProps, UnitViewProps } from "./interfaces";
import { ViewModeEnum, ViewModeStrings } from "../../../enums/viewModEnum";
import FullUnitView from "./FullUnitView";
import UnitPreview from "./UnitPreview";

interface BaseUnitViewProps extends UnitViewProps, UnitActionsProps {
    viewMode?: ViewModeStrings | undefined;
    selected?: boolean;
}

export default function BaseUnitView(props: BaseUnitViewProps) {
    if (props.viewMode === ViewModeEnum.PREVIEW || !props.viewMode) {
        return <UnitPreview {...props} />;
    } else if (props.viewMode === ViewModeEnum.FULL) {
        return <FullUnitView {...props} />;
    }

    return null;
}
