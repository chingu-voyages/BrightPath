"use client";

import { ShareButtons } from "@/app/courses/[slug]/ShareButtons";
import { Print } from "@mui/icons-material";

export default function CertificatePrinter() {
    const handlePrint = () => {
        const certificateRef = document.getElementById("printable-certificate");

        if (!certificateRef) return;

        // Create an invisible iframe
        const printIframe = document.createElement("iframe");
        printIframe.style.position = "absolute";
        printIframe.style.width = "0";
        printIframe.style.height = "0";
        printIframe.style.border = "none";
        printIframe.style.visibility = "hidden";

        document.body.appendChild(printIframe);

        const doc =
            printIframe.contentDocument || printIframe.contentWindow?.document;
        if (!doc) return;

        // Ensure the iframe has access to the stylesheets from the current page
        const stylesheets = Array.from(document.styleSheets)
            .map((styleSheet) => {
                try {
                    // Only get styles that can be accessed
                    return styleSheet.href
                        ? `<link rel="stylesheet" href="${styleSheet.href}">`
                        : "";
                } catch (e) {
                    return ""; // Ignore cross-origin styles
                }
            })
            .join("");

        const fontLinks =
            '<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap" rel="stylesheet">';

        doc.open();
        doc.write(`
            <html>
            <head>
                <title>Print Certificate</title>
                ${fontLinks}
                ${stylesheets} <!-- Link external stylesheets -->
            </head>
            <body style="font-family: 'Josefin Sans', sans-serif;">
                ${certificateRef.outerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => parent.document.body.removeChild(window.frameElement), 500);
                    };
                </script>
            </body>
            </html>
        `);
        doc.close();
    };
    return (
        <>
            <div className="flex items-center justify-center w-full mt-4 space-x-4">
                <button className="button-ghost" onClick={handlePrint}>
                    <Print fontSize="medium" />
                    <span className="pl-1 text-xs">Print Certificate</span>
                </button>
                <ShareButtons url={window.location.href} />
            </div>
        </>
    );
}
