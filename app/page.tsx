"use client";

import { useState } from "react";
import ChevronDown from "./assets/svgs/ChevronDown";
import Logo from "./assets/svgs/Logo";
import { randomBytes } from "crypto";
import { ethers } from "ethers";
import issuerConfig from "../issuer.config.json";
import abi from "./identityRegistryAbi.json";
import { MetaMaskInpageProvider } from "@metamask/providers";

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
	const [expand, setExpand] = useState(false);

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
		// TODO: replace dummy data with actual data
		// Dummy data
		const transcriptName = "Computer Science Degree";
		const receipientName = "John Doe";
		const receipientDid = "did:pulsepersona:565fd38cdbeb31339ecc27c58d601c13";
		const studentNo = "123456789";
		const dateOfBirth = "1995-05-15";
		const description = "Bachelor's Degree in Computer Science";
		const degreeName = "Bachelor of Science";
		const semesters = [
			{
				year: "2020",
				term: "Fall",
				module: "Computer Vision",
				grade: "A",
				credits: "4",
			},
			{
				year: "2020",
				term: "Spring",
				module: "Natural Language Processing",
				grade: "B+",
				credits: "3",
			},
			{
				year: "2021",
				term: "Fall",
				module: "Machine Learning",
				grade: "A-",
				credits: "4",
			},
			// Add more semesters as needed
		];

		const vc = await generateAcademicVC(
			transcriptName,
			receipientName,
			receipientDid,
			studentNo,
			dateOfBirth,
			description,
			degreeName,
			semesters
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

			const tx = await contract.issueClaim(receipientDid, vc.id, vcHash);
			await tx.wait();
			console.log("transaction ", tx);

			const url = window.URL.createObjectURL(
				new Blob([JSON.stringify(vc)], { type: "application/ld+json" })
			);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "Academic Transcript.json");
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
					<button
						className="w-full flex flex-row justify-between items-center px-4 py-2 transition-all hover:bg-zinc-100 rounded-xl"
						onClick={() => setExpand((prev) => !prev)}
					>
						<p>My Grades</p>
						<ChevronDown
							className={`text-theme-black transition-all ${
								expand && "rotate-180"
							}`}
						/>
					</button>
					{expand && (
						<button className="w-full flex justify-start items-center px-2 py-2 transition-all hover:bg-zinc-100 rounded-xl">
							<p className="pl-10">Academic Transcript</p>
						</button>
					)}
				</div>
			</div>

			<div className="container-screen pl-72 bg-zinc-100 py-8 pr-8">
				<div className="w-full flex flex-col justify-start items-start space-y-5">
					<div className="flex flex-col justify-center items-start space-y-1">
						<p className="text-2xl font-medium">Academic Transcript</p>
						<p className="">
							View the academic transcripts and download Verifiable Credentials
						</p>
					</div>
					<div className="w-full h-[1px] bg-zinc-300"></div>
					<div className="w-full grid grid-cols-12 gap-5">
						<div className="col-span-8 w-full flex flex-col p-5 bg-white rounded-xl">
							<p className="uppercase">
								<span className="font-semibold">name: </span>song lin
							</p>
							<p className="uppercase">
								<span className="font-semibold">student no.: </span>a0105509l
							</p>
							<p className="uppercase">
								<span className="font-semibold">date of birth: </span>17/10/1992
							</p>
							<p className="uppercase">
								<span className="font-semibold">date issued: </span>22/06/2016
							</p>

							<div className="w-full h-[1px] my-5 bg-zinc-300"></div>
							<p className="uppercase">
								<span className="font-semibold">programme: </span>
								bachelor of environmental studies
							</p>
							<p className="uppercase">
								<span className="font-semibold">programme status: </span>
								active in programme
							</p>
							<div className="w-full h-[1px] my-5 bg-zinc-300"></div>
							<div className="w-full grid grid-cols-12">
								<div className="col-span-8 w-full">
									<p className="font-semibold underline uppercase">module</p>
									<p className="font-semibold uppercase py-3">
										academic year semester 1
									</p>
									<div className="w-full grid grid-cols-12">
										<div className="col-span-2 w-full">
											<p className="uppercase">env1202</p>
											<p className="uppercase">env2101</p>
											<p className="uppercase">env2103</p>
											<p className="uppercase">ge2228</p>
											<p className="uppercase">lsm3252</p>
											<p className="uppercase">ncc1001</p>
										</div>
									</div>
								</div>
								<div className="col-span-2 w-full">
									<p className="font-semibold underline uppercase">grade</p>
									<p className="font-semibold uppercase py-3 text-white">.</p>
									<div className="w-full grid grid-cols-12">
										<div className="col-span-2 w-full">
											<p className="uppercase">B+</p>
											<p className="uppercase">A+</p>
											<p className="uppercase">B+</p>
											<p className="uppercase">A-</p>
											<p className="uppercase">B</p>
											<p className="uppercase">CS</p>
										</div>
									</div>
								</div>
								<div className="col-span-2 w-full">
									<p className="font-semibold underline uppercase">credits</p>
									<p className="font-semibold uppercase py-3 text-white">.</p>
									<div className="w-full grid grid-cols-12">
										<div className="col-span-2 w-full">
											<p className="uppercase">4.00</p>
											<p className="uppercase">4.00</p>
											<p className="uppercase">4.00</p>
											<p className="uppercase">4.00</p>
											<p className="uppercase">4.00</p>
											<p className="uppercase">4.00</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-start items-start">
							<button
								className="py-3 px-6 rounded-xl bg-theme-black transition-all"
								onClick={handleDownload}
							>
								<p className="text-white whitespace-nowrap">Download VC</p>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
