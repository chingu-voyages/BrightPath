import { Certificate } from "@/types";
import { CertificateComponent } from "./CertificateComponent";

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
            <div className="w-1/2">
                <CertificateComponent certificate={certificate} />
            </div>
        </div>
    );
}
