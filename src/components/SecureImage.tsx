import { Box, BoxProps } from "@mui/material";
import { useSecureImage } from "@/hooks/useSecureImage";

type BoxImgProps = BoxProps<"img">;

interface SecureImageProps extends Omit<BoxImgProps, "src"> {
    source?: string | null;
    fallbackSrc?: string;
}

export default function SecureImage({ source, fallbackSrc, ...boxProps }: SecureImageProps) {
    const { url } = useSecureImage(source);
    const finalSrc = url ?? fallbackSrc;

    if (!finalSrc) return null;

    return <Box component="img" src={finalSrc} {...boxProps} />;
}
