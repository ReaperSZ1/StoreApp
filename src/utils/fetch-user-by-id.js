import User from '../models/User.js';

export const fetchUserById = async (userId) => {
	try {
		const user = await User.findByPk(userId);

		if (!user) {
			return null;
		}

		const { id, favorites, cart } = user;

		return { id, favorites, cart };
	} catch (err) {
		console.error('Erro ao buscar usuário por ID:', err);
		return null;
	}
};

export const updateUserFavorites = async (userId, favorites) => {
	try {
		if (!userId) {
			console.error('invalid userId!');
			return null;
		}
		if (!favorites || !Array.isArray(favorites)) {
			console.error('invalid favorites!');
			return null;
		}

		await User.update({ favorites }, { where: { id: userId } });
	} catch (err) {
		console.error('Error updating favorites:', err);
	}
};
