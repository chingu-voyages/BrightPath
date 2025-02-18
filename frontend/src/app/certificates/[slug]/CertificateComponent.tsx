import { Certificate } from "@/types";
import moment from "moment";
import Image from "next/image";

export const CertificateComponent = ({
    certificate,
    isCompact = false,
}: {
    certificate?: Certificate | null;
    isCompact?: boolean;
}) => {
    let id;
    let SIGNATURE_SRC = null;

    if (certificate) {
        if (
            certificate.enrollment.course.instructorId ===
            "cm797soxk0003o20fawlxbz0a"
        ) {
            SIGNATURE_SRC = "/joseph-kotvas-signature.webp";
        } else if (
            certificate.enrollment.course.instructorId ===
            "cm79hk6ls0006o20ftl6ra6hb"
        ) {
            SIGNATURE_SRC = "/instructor1_signature.png";
        }
    }

    if (!certificate) {
        certificate = {
            id: "00000000-0000-0000",
            issuedAt: new Date(),
            enrollment: {
                course: {
                    title: "Bring Your App to Life with Tailwind Motion",
                },
            },
            user: {
                name: "John Doe",
            },
        } as Certificate;
    }

    if (!isCompact) {
        id = "printable-certificate";
    }

    return (
        <article
            id={id}
            className={`font-brand text-black border rounded shadow text-center ${
                isCompact ? "text-sm p-5" : "text-base p-6 md:p-8 bg-white"
            }`}
        >
            <div className="flex items-center justify-end">
                <Image
                    src="/Logo_WithTagline.png"
                    alt="Logo_WithTagline"
                    width={isCompact ? 120 : 180}
                    height={isCompact ? 40 : 56}
                />
            </div>
            <div
                className={`${isCompact ? "my-4" : "gap-y-2 md:gap-y-3 my-8 md:my-12"} grid`}
            >
                <h3
                    className={`${
                        isCompact ? "text-xl" : "text-headline-xl"
                    } font-bold`}
                >
                    {certificate.user.name}
                </h3>
                <p
                    className={`${
                        isCompact ? "text-xs" : "text-xs md:text-sm"
                    } font-bold`}
                >
                    Has successfully completed all coursework and assignments
                    for the course:
                </p>
                <p
                    className={`font-brand ${
                        isCompact ? "text-xl" : "text-headline-m"
                    } font-extrabold`}
                >
                    {certificate.enrollment.course.title}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <div
                    className={`${
                        isCompact ? "w-1/2 text-xs" : "text-sm md:text-base"
                    } text-left`}
                >
                    {isCompact && (
                        <span className="font-bold">
                            {moment(certificate.issuedAt).format("LL")}
                        </span>
                    )}

                    {!isCompact && (
                        <>
                            <p>
                                <span className="pr-1">Issued on:</span>
                                <span className="font-bold">
                                    {moment(certificate.issuedAt).format("LL")}
                                </span>
                            </p>
                            <p>
                                <span className="pr-1">Certificate ID:</span>
                                <span className="font-bold">
                                    {certificate.id}
                                </span>
                            </p>
                        </>
                    )}
                </div>
                <div className="w-1/2 relative">
                    {SIGNATURE_SRC && (
                        <Image
                            src={SIGNATURE_SRC}
                            alt="Instructor Signature"
                            className="mx-auto -mb-4"
                            width={isCompact ? 100 : 200}
                            height={isCompact ? 40 : 80}
                        />
                    )}
                    {!isCompact && (
                        <p className={`border-t-2 border-black mt-2 md:mt-4`}>
                            Instructor Signature
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
};
