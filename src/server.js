import axios from 'axios';

let server = axios.create({
	baseURL: '/vuecourseapi/'
});

export default server;