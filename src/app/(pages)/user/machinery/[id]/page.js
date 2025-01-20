"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Tool, Building2, Category, Star, User as UserIcon, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingComponent';
import { fetchMachineryDetails, updateMachineryReview } from '@/lib/store/features/subContractorSlice';

const RatingStars = ({ rating }) => (
	<div className="flex gap-1">
		{[1, 2, 3, 4, 5].map((star) => (
			<Star
				key={star}
				className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
			/>
		))}
		<span className="ml-1 text-sm text-gray-600">({rating})</span>
	</div>
);

const Page = ({ params }) => {
	const { id } = React.use(params);
	const dispatch = useDispatch();
	const router = useRouter();
	const reviewedBy = useSelector((state) => state.auth.user?.user?._id);
	const userRole = useSelector((state) => state.auth.user?.user?.role);
	const machinery = useSelector((state) => state.subContractor.selectedMachinery);
	const loading = useSelector((state) => state.subContractor.machineryDetailsLoading);

	const [ratings, setRatings] = useState({
		performance: 0,
		durability: 0,
		costEfficiency: 0,
		reliability: 0,
		review: ''
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (id) {
			dispatch(fetchMachineryDetails(id));
		}
	}, [dispatch, id]);

	const handleRatingChange = (type, value) => {
		setRatings(prev => ({
			...prev,
			[type]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;

		if (!ratings.performance || !ratings.durability ||
			!ratings.costEfficiency || !ratings.reliability) {
			toast.error('Please provide all ratings');
			return;
		}

		setIsSubmitting(true);
		try {
			await dispatch(updateMachineryReview({
				id,
				rating: [{
					performance: Number(ratings.performance),
					durability: Number(ratings.durability),
					costEfficiency: Number(ratings.costEfficiency),
					reliability: Number(ratings.reliability),
					review: ratings.review?.trim() || '',
					reviewedBy: reviewedBy,
				}]
			})).unwrap();

			setRatings({
				performance: 0,
				durability: 0,
				costEfficiency: 0,
				reliability: 0,
				review: ''
			});
			toast.success('Review added successfully!');
		} catch (error) {
			toast.error(error.message || 'Failed to update review');
		} finally {
			setIsSubmitting(false);
		}
	};

	const calculateAverageRatings = () => {
		if (!machinery?.rating || machinery.rating.length === 0) return null;

		const sum = machinery.rating.reduce((acc, curr) => ({
			total: acc.total + ((curr.performance + curr.durability + curr.costEfficiency + curr.reliability) / 4 || 0),
			performance: acc.performance + (curr.performance || 0),
			durability: acc.durability + (curr.durability || 0),
			costEfficiency: acc.costEfficiency + (curr.costEfficiency || 0),
			reliability: acc.reliability + (curr.reliability || 0)
		}), { total: 0, performance: 0, durability: 0, costEfficiency: 0, reliability: 0 });

		const count = machinery.rating.length;
		return {
			total: (sum.total / count).toFixed(1),
			performance: (sum.performance / count).toFixed(1),
			durability: (sum.durability / count).toFixed(1),
			costEfficiency: (sum.costEfficiency / count).toFixed(1),
			reliability: (sum.reliability / count).toFixed(1)
		};
	};

	if (loading) {
		return <PageLoader />;
	}

	if (!machinery) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
				<div className="bg-white p-8 rounded-2xl shadow-xl text-center">
					<h2 className="text-2xl font-bold text-gray-800 mb-4">No Machinery Found</h2>
					<p className="text-gray-600 mb-6">The machinery you're looking for doesn't exist or has been removed.</p>
					<button
						onClick={() => router.push('/user/dashboard')}
						className="flex items-center justify-center space-x-2 mx-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>Go Back</span>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
			<div className="container mx-auto max-w-6xl">
				<button
					onClick={() => router.push("/user/dashboard")}
					className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
				>
					<ArrowLeft className="w-5 h-5 mr-2" />
					Back
				</button>

				<div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 space-y-6">
					{/* Machinery Header */}
					<div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-blue-50 rounded-xl">
						<div className="flex-grow space-y-2">
							<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
								<h1 className="text-2xl md:text-3xl font-bold text-blue-800">{machinery?.name}</h1>
								<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${machinery?.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
									{machinery?.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
								<p className="flex items-center justify-center md:justify-start gap-2">
									<Building2 className="w-4 h-4" />
									Sub Company: {machinery?.subCompanyName}
								</p>
								<p className="flex items-center justify-center md:justify-start gap-2">
									{/* <Category className="w-4 h-4" /> */}
									Category: {machinery?.category}
								</p>
								<p className="flex items-center justify-center md:justify-start gap-2">
									{/* <Tool className="w-4 h-4" /> */}
									Model: {machinery?.model}
								</p>
								<p className="flex items-center justify-center md:justify-start gap-2">
									{/* <Building2 className="w-4 h-4" /> */}
									Type: {machinery?.type}
								</p>
							</div>
						</div>
					</div>

					{/* Ratings Section */}
					<div className="bg-gray-50 rounded-xl p-4 md:p-6">
						<h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
							<Star className="w-5 h-5" />
							Ratings & Reviews
						</h2>

						{/* Average Ratings */}
						{calculateAverageRatings() && (
							<div className="bg-white p-4 rounded-lg mb-4">
								<h3 className="text-lg font-semibold text-blue-700 mb-3">
									Average Rating: <RatingStars rating={calculateAverageRatings().total} />
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600 mb-1">Performance</p>
										<RatingStars rating={calculateAverageRatings().performance} />
									</div>
									<div>
										<p className="text-sm text-gray-600 mb-1">Durability</p>
										<RatingStars rating={calculateAverageRatings().durability} />
									</div>
									<div>
										<p className="text-sm text-gray-600 mb-1">Cost Efficiency</p>
										<RatingStars rating={calculateAverageRatings().costEfficiency} />
									</div>
									<div>
										<p className="text-sm text-gray-600 mb-1">Reliability</p>
										<RatingStars rating={calculateAverageRatings().reliability} />
									</div>
								</div>
							</div>
						)}

						{/* Reviews List */}
						{Array.isArray(machinery?.rating) && machinery.rating.length > 0 ? (
							<div className="space-y-3">
								{machinery.rating.map((rate, index) => (
									<div key={index} className="bg-white p-3 rounded-lg text-sm">
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<UserIcon className="w-4 h-4 text-blue-500" />
												<span className="font-medium">{rate.reviewedBy?.name || 'Anonymous'}</span>
												<span className="text-gray-500 text-xs">
													{new Date(rate.createdAt).toLocaleDateString()}
												</span>
											</div>
											<div>
												<RatingStars rating={(
													(rate.performance + rate.durability + rate.costEfficiency + rate.reliability) / 4
												).toFixed(1)} />
											</div>
										</div>
										<div className="grid grid-cols-2 gap-2 mb-2">
											{['performance', 'durability', 'costEfficiency', 'reliability'].map((type) => (
												<div key={type} className="flex items-center gap-1">
													<span className="text-gray-600">
														{type === 'costEfficiency' ? 'Cost Efficiency' :
															type.charAt(0).toUpperCase() + type.slice(1)}:
													</span>
													<RatingStars rating={rate[type]} />
												</div>
											))}
										</div>
										{rate.review && (
											<p className="text-gray-600 text-sm bg-gray-50 p-2 rounded mt-2">
												"{rate.review}"
											</p>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600">No ratings available.</p>
						)}

						{(userRole === "production" || userRole === "supervisor") && (
							<form onSubmit={handleSubmit} className="mt-6 space-y-4">
								<div className="grid grid-cols-2 gap-4">
									{['performance', 'durability', 'costEfficiency', 'reliability'].map((type) => (
										<div key={type} className="bg-white p-3 rounded-lg">
											<label className="block text-sm text-gray-700 capitalize mb-2">
												{type === 'costEfficiency' ? 'Cost Efficiency' : type}
											</label>
											<div className="flex gap-1">
												{[1, 2, 3, 4, 5].map((value) => (
													<button
														type="button"
														key={value}
														onClick={() => handleRatingChange(type, value)}
														className={`p-1 rounded-full ${ratings[type] >= value ? 'text-yellow-400' : 'text-gray-300'}`}
													>
														<Star className="w-5 h-5 fill-current" />
													</button>
												))}
											</div>
										</div>
									))}
								</div>

								<div className="bg-white p-3 rounded-lg">
									<label className="block text-sm text-gray-700 mb-2">Review Comments</label>
									<textarea
										value={ratings.review}
										onChange={(e) => handleRatingChange('review', e.target.value)}
										className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
										rows="3"
										placeholder="Add your review comments..."
									/>
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full py-2 px-4 ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
								>
									<Shield className="w-4 h-4" />
									{isSubmitting ? 'Submitting...' : 'Submit Review'}
								</button>
							</form>
						)}
					</div>

					<div className="bg-gray-50 rounded-xl p-4">
						<h3 className="text-lg font-semibold mb-4">Work History</h3>
						{machinery?.costDetails?.map(detail => (
							<div key={detail?.projectId} className="mb-4 p-4 bg-white rounded">
								<h4 className="font-medium">Project ID: {detail?.projectId}</h4>
								<p>Hourly Rate: ${detail?.hourlyRate}</p>
								<p>Total Hours: {detail?.totalHours}</p>
								<p>Total Cost: ${(detail?.totalHours * detail?.hourlyRate).toFixed(2)}</p>
								<div className="mt-2">
									<h5 className="text-sm font-medium">Recent Work History:</h5>
									{detail.workHistory?.map((work, index) => (
										<div key={index} className="text-sm text-gray-600">
											{new Date(work?.date).toLocaleDateString()}: {work?.hours} hours
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;