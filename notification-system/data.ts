export const DATA: {id: string, email: string}[] = 
    Array.from({length: 10}, (_v, i) => {
        return {
            id: i.toString(),
            email: `${i}@gmail.com`
        }
    })
