import User from '../models/User.js'; 

export const fetchUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) return null;

    const { id, favorites } = user;
    return { id, favorites };
    } catch (err) {
        console.error('Erro ao buscar usuário por ID:', err);
        return null;
    }
};

export const updateUserFavorites = async (userId, favorites) => {
    try {
      await User.update( { favorites }, { where: { id: userId } });
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
};
  