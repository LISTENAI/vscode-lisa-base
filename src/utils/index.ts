import * as Configstore from 'configstore';
const config = new Configstore('lisa');
export  function checkLogin(){
	const sessions = config.get('userInfo');
	if (sessions && (sessions.expire || 0) > new Date().getTime()) {
		return true;
	} else{
		return false;
	}
}