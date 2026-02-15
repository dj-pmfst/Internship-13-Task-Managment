export class LocalStorage{

    static enableDarkMode(){
        localStorage.setItem('darkMode', 'enabled');
    }

    static disableDarkMode(){
        localStorage.setItem('darkMode', 'disabled');
    }

    static isDarkMode(){
        return localStorage.getItem('darkMode') === 'enabled';
    }
}