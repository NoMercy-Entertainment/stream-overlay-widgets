import axiosClient from '@/utils/axiosClient';

export default <T>(timeout?: number) => {
	return axiosClient<T>(`${location.origin}/api`, timeout);
};
