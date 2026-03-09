import { AppDataSource } from '@database/data-source';

AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established.');
    })
    .catch(err => {
        console.error('Error during database initialization:', err);
        process.exit(1);
    });

export { AppDataSource };
