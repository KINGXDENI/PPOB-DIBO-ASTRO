// SkeletonLoader.jsx
const SkeletonLoader = () => {
	return (
		<div className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700 max-w-[120px] shadow-sm animate-pulse">
			<div className="w-10 h-10 mb-1 bg-gray-300 rounded-full"></div>
			<div className="w-24 h-4 bg-gray-300 rounded mb-1"></div>
			<div className="w-16 h-4 bg-gray-300 rounded"></div>
		</div>
	);
};

export default SkeletonLoader;
