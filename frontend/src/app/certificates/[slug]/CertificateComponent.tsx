import { Certificate } from "@/types";
import moment from "moment";
import Image from "next/image";

export const CertificateComponent = ({
    certificate,
}: {
    certificate: Certificate;
}) => {
    return (
        <article className="border rounded shadow p-8 text-center">
            <div className="flex items-center justify-end">
                <Image
                    src="/Logo_WithTagline.png"
                    alt="Logo_WithTagline"
                    width="180"
                    height="56"
                />
            </div>
            <div className="grid gap-y-3 my-12">
                <h3 className="text-5xl font-normal">
                    {certificate.user.name}
                </h3>
                <p className="font-bold">
                    Has successfully completed all coursework and assignments
                    for the course:
                </p>
                <p className="font-brand text-3xl font-extrabold">
                    {certificate.enrollment.course.title}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <p>
                        Issued on:{" "}
                        <span className="font-bold">
                            {moment(certificate.issuedAt).format("LL")}
                        </span>
                    </p>
                    <p>
                        Certificate ID:{" "}
                        <span className="font-bold">{certificate.id}</span>
                    </p>
                </div>
                <div className="w-64">
                    <p></p>
                    <p className="border-t-2 border-black">
                        Instructor Signature
                    </p>
                </div>
            </div>
        </article>
    );
};
