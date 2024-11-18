
module.exports = {

    checkToken: (req, res, next) => {
        const header = req.headers['authorization'];

        if (typeof header !== 'undefined') {
            const bearer = header.split(' ');
            const token = bearer[1];

            req.token = token;
            next();
        } else {
            //If header is undefined return Forbidden (403)
            res.sendStatus(403)
        }
    },

    getMonthName: (number) => {
        let monthName = ''

        switch (number) {
            case 0:
                monthName='Jan';
                break;
            case 1:
                monthName='Feb';
            case 2:
                monthName='Mar';
                break;
            case 3:
                monthName='Apr';
            case 4:
                monthName='May';
                break;
            case 5:
                monthName='Jun';
            case 6:
                monthName='Jul';
                break;
            case 7:
                monthName='Aug';
                break;
            case 8:
                monthName='Sep';
                break;
            case 9:
                monthName='Oct';
            case 10:
                monthName='Nov';
                break;
            case 11:
                monthName='Dec';
            break;
        }

        return monthName;
    }

}
