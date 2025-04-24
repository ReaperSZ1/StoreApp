import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../Database/connection.js';

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		provider: {
			type: DataTypes.STRING,
			defaultValue: 'local'
		},
		googleId: {
			type: DataTypes.STRING,
			allowNull: true
		},
		facebookId: {
			type: DataTypes.STRING,
			allowNull: true
		},
		favorites: {
			type: DataTypes.JSON,
			defaultValue: []
		}
	},
	{ timestamps: false }
);

User.beforeCreate(async (user) => {
	if (user.password) {
		user.password = await bcrypt.hash(user.password, 10);
	}
});

User.prototype.comparePassword = function (password) {
	if (password === 'google-login' || password === 'facebook-login') {
		return false;
	}
	return bcrypt.compare(password, this.password);
};

export default User;
