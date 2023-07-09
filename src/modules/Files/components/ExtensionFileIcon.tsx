import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import TableViewIcon from "@mui/icons-material/TableView";
import ImageIcon from "@mui/icons-material/Image";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export interface ExtensionFileIconProps {
    extension: string;
}

export default function ExtensionFileIcon(props: ExtensionFileIconProps) {
    switch (props.extension) {
        case "pdf":
            return <PictureAsPdfIcon />;
        case "doc":
        case "docx":
            return <DescriptionIcon />;
        case "odp":
        case "ppt":
        case "pptx":
            return <CoPresentIcon />;
        case "png":
        case "jpg":
        case "jpeg":
        case "bmp":
            return <ImageIcon />;
        case "7z":
        case "tar":
        case "gzip":
        case "zip":
            return <FolderZipIcon />;
        case "xls":
        case "xlsx":
            return <TableViewIcon />;
        case "csv":
            return <TextSnippetIcon />;
        default:
            return <InsertDriveFileIcon />;
    }
}
