import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader'; // Adjust the path as necessary

const PulsaSearch = () => {
	const [products, setProducts] = useState([]);
	const [inputNumber, setInputNumber] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [debounceTimeout, setDebounceTimeout] = useState(null);
	const [searchIcon, setSearchIcon] = useState('/search.png'); // Default search icon

	const fetchProducts = async () => {
		if (!inputNumber) {
			setProducts([]); // Clear the products state if input is empty
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await fetch('https://apistore.dibo.my.id/pulsa', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': '123Deni',
				},
				body: JSON.stringify({ nomor: inputNumber }),
			});

			if (!response.ok) {
				throw new Error(`Error fetching products: ${response.statusText}`);
			}

			const data = await response.json();
			const listProduk = data.listProduk || [];
			const produk = data.produk || [];

			// Set the search icon based on the first product in listProduk if available
			if (listProduk.length > 0) {
				setSearchIcon(listProduk[0].foto); // Assuming 'foto' contains the URL for the icon
			}

			// Use produk data directly
			setProducts(produk);
		} catch (err) {
			setError('Tidak menemukan produk.'); // Set the error message
			setProducts([]); // Clear the products state
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		const timeout = setTimeout(() => {
			fetchProducts();
		}, 500);

		setDebounceTimeout(timeout);

		return () => clearTimeout(timeout);
	}, [inputNumber]);

	return (
		<div className="px-4 pt-6">
			<form className="flex items-center max-w-sm mx-auto mb-4">
				<label htmlFor="phoneNumber" className="sr-only">
					Nomor Telepon
				</label>
				<div className="relative w-full">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<img
							src={searchIcon} // Use the dynamic search icon
							alt="Search icon"
							className="w-4 h-4 text-gray-500"
						/>
					</div>
					<input
						type="number"
						id="phoneNumber"
						className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						onChange={(e) => {
							setInputNumber(e.target.value);
							if (!e.target.value) setProducts([]); // Clear products if input is empty
						}}
						placeholder="Masukkan nomor"
						required
					/>
				</div>
			</form>

			{loading ? (
				<div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-9">
					{[...Array(3)].map((_, index) => (
						<SkeletonLoader key={index} />
					))}
				</div>
			) : (
				<>
					{error && <p className="text-center text-gray-700">{error}</p>}
					{products.length > 0 ? (
						<div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-9">
							{products.map((product) => (
								<div
									key={product.id}
									className="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700 max-w-[120px]"
								>
									<img
										src={product.foto}
										alt={product.nama}
										className="w-10 h-10 mb-1 object-cover rounded-full"
									/>
									<h3 className="text-xs font-semibold text-gray-900 dark:text-white text-center">
										{product.nama}
									</h3>
									<span className="text-xs text-gray-500">
										{product.harga}
									</span>
									<span className="hidden">{product.kode}</span>
								</div>
							))}
						</div>
					) : (
						!error && (
							<p className="text-center text-gray-500">
								Tidak ada produk ditemukan.
							</p>
						)
					)}
				</>
			)}
		</div>
	);
};

export default PulsaSearch;
