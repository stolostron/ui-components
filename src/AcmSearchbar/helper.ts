export const convertStringToTags = (searchText: string) => {
    const queryItems = searchText.split(' ')
    const tags = queryItems.map((item) => {
        return {
            id: item,
            name: item,
        }
    })
    return tags
}
