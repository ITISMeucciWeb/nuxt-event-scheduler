export function getCurrentRound(eventDay: string, hours: string[], hourLength: number) {
    const startDate = new Date(eventDay);
    let startDay = startDate.getDay() - 1;
    if (startDay === -1) {
        startDay = 6;
    } // Sunday is 6, not 0

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    let currentDay = now.getDay() - 1;
    if (currentDay === -1) {
        currentDay = 6;
    } // Again, sunday is 6, not 0

    // Parse hours in config
    const parsedHours = [];
    for (const i in hours) {
        const CompleteHour = hours[i].split(':');
        parsedHours.push(Number(CompleteHour[0]) + Number(CompleteHour[1]) / 60);
    }

    if (currentHour - parsedHours[0] < 0) {
        throw createError({statusMessage: 'The user is too early', statusCode: 403});
    }
    if (currentHour - parsedHours[parsedHours.length - 1] > hourLength) {
        throw createError({statusMessage: 'The user is too late', statusCode: 403});
    }

    const roundHour = parsedHours.findIndex((hour) => {
        return currentHour > hour && currentHour < hour + hourLength;
    });

    const roundDay = currentDay - startDay;

    return roundDay * hours.length + roundHour + 1;
}

export function getCurrentRoundSafe(...args: Parameters<typeof getCurrentRound>): number {
    try {
        return getCurrentRound(...args);
    } catch (e) {
        if (process.env.NODE_ENV !== 'development') {
            throw e;
        }
    }

    return 0;
}