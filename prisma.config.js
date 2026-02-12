export default {
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL,
    },
}
