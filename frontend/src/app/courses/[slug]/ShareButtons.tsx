import { Facebook, LinkedIn } from "@mui/icons-material";

export const ShareButtons = ({ url }: { url: string }) => {
    return (
        <div className="flex justify-between items-center space-x-4 my-4">
            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
                target="_blank"
                rel="noreferrer"
                className="button-ghost text-no-wrap text-xs"
            >
                <LinkedIn />
                Share on LinkedIn
            </a>
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                target="_blank"
                rel="noreferrer"
                className="button-ghost text-nowrap text-xs"
            >
                <Facebook />
                Share on Facebook
            </a>
        </div>
    );
};
