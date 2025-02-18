import { Certificate } from "@/types";
import { CertificateComponent } from "./CertificateComponent";
import CertificatePrinter from "./CertificatePrinter";
import { ShareButtons } from "@/app/courses/[slug]/ShareButtons";

export default async function CertificatePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const id = (await params).slug;
    const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/certificates/" + id,
    );
    const certificate: Certificate = await res.json();

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="xs:w-1/2">
                <CertificateComponent certificate={certificate} />
                <CertificatePrinter />
            </div>
        </div>
    );
}
