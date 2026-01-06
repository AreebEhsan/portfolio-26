export type CertificationImage = {
  src: string; // path under /public
  alt: string;
  width: number;
  height: number;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialId?: string;
  url?: string; // optional credential URL
  image: CertificationImage;
};

export const certifications: Certification[] = [
  {
    id: "aws-ccp",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issued: "Jan 2024",
    expires: "Jan 2027",
    image: {
      src: "/certificates/aws-ccp.png",
      alt: "AWS Certified Cloud Practitioner certificate for Areeb Ehsan",
      width: 1200,
      height: 850,
    },
  },
  {
    id: "ibm-cybersecurity-analyst",
    name: "IBM Cybersecurity Analyst",
    issuer: "IBM",
    issued: "Jul 2023",
    credentialId: "35C2W9DAR6NS",
    image: {
      src: "/certificates/ibm-cybersecurity-analyst.png",
      alt: "IBM Cybersecurity Analyst certificate for Areeb Ehsan",
      width: 1200,
      height: 850,
    },
  },
];
