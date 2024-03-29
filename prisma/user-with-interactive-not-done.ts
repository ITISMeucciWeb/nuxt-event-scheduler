import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findUsersWithInteractiveNotDone() {
    // @ts-ignore
    return prisma.user.findMany({
        where: {
            interactiveDone: false
        },
        select: {
            name: true,
            email: true
        }
    });
}

findUsersWithInteractiveNotDone()
    .then((users) => {
        let str = "";
        users.forEach((user) => {
            // only show emails that contain at least one uppercase letter
            str += ` ${user.email}`;
        });
        str = str.trim();
        console.log(str);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
