"use client";

export default function IndustrialsPage() {
	return (
		<div className="container mx-auto max-w-7xl min-h-screen p-8 md:p-4 bg-gradient-to-b from-blue-50 to-white">
			<h1 className="text-2xl md:text-2xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
				Industrials Page
			</h1>

			<div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
				<iframe
					className="w-full h-[500px] border-none"
					src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2eAzjrI0m-C0KKIlS3x2oxefCqGJQjuVjLN3X6OmUKlX9yVKyhPTgp4zeS4T6EA/pubhtml?gid=901954653&amp;single=true&amp;widget=true&amp;headers=false"
				/>
			</div>
		</div>
	);	
}
