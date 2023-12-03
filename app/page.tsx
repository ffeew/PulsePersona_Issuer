"use client";

import { useState } from "react";
import Logo from "./assets/svgs/Logo";
import { randomBytes } from "crypto";
import { ethers } from "ethers";
import issuerConfig from "../issuer.config.json";
import abi from "./identityRegistryAbi.json";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { students } from "./utils/students";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
type Grades = {
  year: string;
  term: string;
  module: string;
  grade: string;
  credits: string;
};

type AcademicTranscriptVC = {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string;
  name: string;
  issuanceDate: string;
  credentialSubject: {
    id: string;
    name: string;
    studentNo: string;
    dateOfBirth: string;
    type: string;
    description: string;
    semesters: Grades[];
  };
};

export default function Home() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [did, setDid] = useState<any>(null);

  const generateAcademicVC = async (
    transcriptName: string,
    receipientName: string,
    receipientDid: string,
    studentNo: string,
    dateOfBirth: string,
    description: string,
    degreeName: string,
    semesters: Grades[]
  ) => {
    const vcId = ethers.hexlify(randomBytes(32));
    const vc: AcademicTranscriptVC = {
      "@context": [
        "https://www.w3.org/ns/credentials/v2",
        "https://w3id.org/security/suites/ed25519-2020/v1",
      ],
      id: vcId,
      type: ["VerifiableCredential", "AcademicTranscriptCredential"],
      name: transcriptName,
      issuer: issuerConfig.issuerDid,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: receipientDid,
        name: receipientName,
        studentNo: studentNo,
        type: degreeName,
        dateOfBirth: dateOfBirth,
        description: description,
        semesters: semesters,
      },
    };
    return vc;
  };

  const handleDownload = async () => {
    if (!did) {
      alert("DID must be provided to generate VC.");
    }

    const vc = await generateAcademicVC(
      selectedStudent.transcriptName,
      selectedStudent.receipientName,
      did,
      selectedStudent.studentNo,
      selectedStudent.dateOfBirth,
      selectedStudent.description,
      selectedStudent.degreeName,
      selectedStudent.semesters
    );

    const vcBytes = ethers.toUtf8Bytes(JSON.stringify(vc));
    const vcHash = ethers.keccak256(vcBytes);
    console.log("VC hash", vcHash);

    try {
      if (window.ethereum == null) {
        throw new Error("MetaMask is not installed");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        issuerConfig.smartContractAddress,
        abi,
        signer
      );
      console.log("VC ID ", vc.id);
      const tx = await contract.issueClaim(did, vc.id, vcHash);
      await tx.wait();
      console.log("transaction ", tx);

      const url = window.URL.createObjectURL(
        new Blob([JSON.stringify(vc)], { type: "application/ld+json" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Academic Transcript.jsonld");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed w-64 min-h-screen flex flex-col justify-start items-center px-5 py-8 space-y-20 bg-white">
        <div className="w-full flex flex-row justify-start items-center space-x-4">
          <Logo className="w-16 h-16 text-theme-black -rotate-45" />
          <p className="text-lg font-semibold text-left">Somapah University</p>
        </div>
        <div className="w-full flex flex-col justify-start items-center space-y-2">
          <button className="w-full flex justify-start items-center px-5 py-3 transition-all hover:bg-zinc-100 rounded-xl">
            <p>Students</p>
          </button>
        </div>
      </div>

      <div className="container-screen pl-72 bg-zinc-100 py-8 pr-8">
        <div className="w-full flex flex-col justify-start items-start space-y-5">
          <div className="flex flex-col justify-center items-start space-y-1">
            <p className="text-2xl font-medium">Students</p>
            <p className="">All students from Somapah University</p>
          </div>
          <div className="w-full h-[1px] bg-zinc-300"></div>
          {/* table goes here */}
          {selectedStudent ? (
            <div className="w-full flex flex-col justify-center items-start space-y-5">
              <button onClick={() => setSelectedStudent(null)}>
                <p>{`< Back`}</p>
              </button>
              <div className="w-full grid grid-cols-12 gap-5">
                <div className="col-span-7 w-full flex flex-col justify-center items-start p-7 space-y-7 bg-white rounded-3xl">
                  <p className="text-lg font-semibold">Student Details</p>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">Student ID</p>
                    <p className="text-lg font-medium">
                      {selectedStudent.studentNo}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">First name</p>
                    <p className="text-lg font-medium">
                      {selectedStudent.firstName}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">Last name</p>
                    <p className="text-lg font-medium">
                      {selectedStudent.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">Date of Birth</p>
                    <p className="text-lg font-medium">
                      {selectedStudent.dateOfBirth}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">Degree</p>
                    <p className="text-lg font-medium">
                      {selectedStudent.degreeName}
                    </p>
                  </div>
                </div>
                <div className="col-span-5 w-full flex flex-col justify-start items-start p-7 space-y-7 bg-white rounded-3xl">
                  <p className="text-lg font-semibold">
                    Download Verifiable Credentials
                  </p>
                  <div className="w-full flex flex-col space-y-3">
                    <p className="font-medium">Student DID</p>
                    <input
                      className="w-full font-normal placeholder:font-normal placeholder:text-zinc-400 bg-zinc-100 rounded-2xl py-4 px-5"
                      placeholder="Enter Student DID"
                      onChange={(e) => setDid(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full py-4 px-6 rounded-2xl bg-theme-black/90"
                    onClick={handleDownload}
                  >
                    <p className="text-white">Download VC</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center py-5 divide-y-2 divide-zinc-100 bg-white rounded-3xl">
              <div className="w-full grid grid-cols-12 py-3 px-5">
                <div className="col-span-1"></div>
                <div className="col-span-2">
                  <p className="font-semibold">Student ID</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">First name</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Last name</p>
                </div>
                <div className="col-span-2">
                  <p className="font-semibold">Date of Birth</p>
                </div>
                <div className="col-span-3">
                  <p className="font-semibold">Degree</p>
                </div>
              </div>
              {students.map((student, index) => (
                <div
                  key={index}
                  className={`w-full grid grid-cols-12 px-5 py-3 ${
                    index % 2 === 0 ? "bg-zinc-100" : "bg-white"
                  }`}
                >
                  <div className="col-span-1">
                    <button
                      className="py-2 px-4 rounded-2xl bg-theme-black/90"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <p className="text-sm text-white">View</p>
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start items-center">
                    <p>{student.studentNo}</p>
                  </div>
                  <div className="col-span-2 flex justify-start items-center">
                    <p>{student.firstName}</p>
                  </div>
                  <div className="col-span-2 flex justify-start items-center">
                    <p>{student.lastName}</p>
                  </div>
                  <div className="col-span-2 flex justify-start items-center">
                    <p>{student.dateOfBirth}</p>
                  </div>
                  <div className="col-span-3 flex justify-start items-center">
                    <p>{student.degreeName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
