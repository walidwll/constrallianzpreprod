"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Building2, Download, Loader, ArrowLeft } from 'lucide-react';

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== 'undefined' ? window.innerWidth : 0,
		height: typeof window !== 'undefined' ? window.innerHeight : 0,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
			handleResize();
			return () => window.removeEventListener('resize', handleResize);
		}
	}, []);

	return windowSize;
};

const GenerateQRCode = () => {
	const router = useRouter();
	const user = useSelector((state) => state.auth.user?.user);
	const qrRef = useRef();
	const [isGenerating, setIsGenerating] = useState(false);
	const { width } = useWindowSize();


	const getQRSize = () => {
		if (width < 380) return 200;
		if (width < 480) return 250;
		if (width < 768) return 300;
		return 350;
	};

	const downloadQRAsPDF = async () => {
		setIsGenerating(true);
		const input = qrRef.current;
		try {
			const canvas = await html2canvas(input, {
				scale: 4,
				logging: false,
				useCORS: true,
				backgroundColor: '#ffffff'
			});

			const imgData = canvas.toDataURL('image/png', 1.0);
			const pdf = new jsPDF('portrait', 'pt', 'a4');
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();

			pdf.setFontSize(24);
			pdf.setTextColor(0, 67, 156);
			pdf.text('Site Management System', pageWidth / 2, 40, { align: 'center' });


			const imgWidth = pageWidth * 0.7;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			const imgX = (pageWidth - imgWidth) / 2;
			pdf.addImage(imgData, 'PNG', imgX, 80, imgWidth, imgHeight);


			pdf.setFontSize(16);
			pdf.setTextColor(70, 70, 70);
			const detailsY = imgHeight + 120;
			pdf.text('Subcontractor Details', pageWidth / 2, detailsY, { align: 'center' });

			pdf.setFontSize(14);
			pdf.text(`Name: ${user.name}`, pageWidth / 2, detailsY + 30, { align: 'center' });
			pdf.text(`Email: ${user.email}`, pageWidth / 2, detailsY + 50, { align: 'center' });
			pdf.text(`ID: ${user._id}`, pageWidth / 2, detailsY + 70, { align: 'center' });

			pdf.setFontSize(10);
			pdf.setTextColor(128, 128, 128);

			pdf.save('contractor_qr_code.pdf');
		} catch (error) {
			console.error('Error generating PDF:', error);
		} finally {
			setIsGenerating(false);
		}
	};

	if (!user || user?.role !== 'supervisor') {
		return <div className='flex justify-center align-center'>Access Denied</div>;
	}

	const qrData = JSON.stringify({
		id: user._id,
		name: user.name,
		email: user.email,
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 flex flex-col items-center">
			<div className="max-w-3xl w-full">
				<button
					onClick={() => router.push('/user/dashboard')}
					className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					<span>Back </span>
				</button>

				<div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-8 mb-4 sm:mb-8">
					<div className="flex items-center justify-center mb-4 sm:mb-8">
						<Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mr-2 sm:mr-3" />
						<h1 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center">
							Production Manager QR Code
						</h1>
					</div>

					<div
						ref={qrRef}
						className="bg-white p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg 
						border-2 border-blue-100 flex flex-col items-center mx-auto"
						style={{ maxWidth: '100%', width: 'fit-content' }}
					>
						<QRCodeCanvas
							value={qrData}
							size={getQRSize()}
							level="H"
							includeMargin={true}
							imageSettings={{
								excavate: true,
								margin: 4
							}}
						/>
						<div className="mt-4 sm:mt-6 text-center w-full">
							<p className="text-xl sm:text-2xl font-semibold text-blue-800 mb-1 sm:mb-2 break-words">
								{user.name}
							</p>
							<p className="text-base sm:text-lg text-blue-600 break-words">
								{user.email}
							</p>
							<p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">
								ID: {user._id}
							</p>
						</div>
					</div>

					<button
						onClick={downloadQRAsPDF}
						disabled={isGenerating}
						className="mt-6 sm:mt-8 w-full bg-blue-600 text-white px-4 sm:px-8 py-2 sm:py-3 
						rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-300 
						flex items-center justify-center space-x-2 disabled:bg-blue-300 text-sm sm:text-base"
					>
						{isGenerating ? (
							<>
								<Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
								<span>Generating PDF...</span>
							</>
						) : (
							<>
								<Download className="w-4 h-4 sm:w-5 sm:h-5" />
								<span>Download QR Code (PDF)</span>
							</>
						)}
					</button>
				</div>
			</div>

			<div className="text-center text-xs sm:text-sm text-gray-600 px-4">
				<p className="mb-1">This QR code can be used for contractor verification at construction sites.</p>
				<p>Please keep it safe and accessible.</p>
			</div>
		</div>
	);
};

export default GenerateQRCode;