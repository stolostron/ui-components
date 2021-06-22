# Collections

Collections are designed to be an efficient way to manage collections of items.

Changes to a collection are emitted as events that other collections can listen and react to.

Instead of filtering, searching, sorting, and paging a whole array anytime there is a change, collections will only filter, search, sort, and page the changes. This makes collections much more efficient and scalable.

## Collection Types

- **Collection**: A writeable collection that is used as the source for other collections.
- **FilteredCollection**: Used to filter a source collection.
- **SearchedCollection**: Used to search a source collection.
- **SortedCollection**: Used to sort a source collection.
- **SelectedCollection**: Used to manage the selected items of a source collection.
- **PagedCollection**: Used to page a source collection.

## React Hooks

Collections bypass much of the react state management for efficiency.
Only when something changes that affects the rendered state will the collections emit state change.

Collections have a set of react hooks for managing collections and state.

```
const [collection] = useState(() => new Collection(item => item.metadata.uid))
const collectionCount = useCollectionCount(collection)

const [filter1, setFilter1] = useState(null)
const filtered1 = useFilter(collection, filter1) 

const [filter2, setFilter2] = useState(null)
const filtered2 = useFilter(filtered1, filter2) 

const filteredCount = useCollectionCount(filtered2)

const [search, setSearch] = useState("")
const [searchOptions] = useState({ keys: ['metadata.name', metadata.namespace','metadata.labels'] })
const searched = useSearch(filtered2, search, searchOptions) 
const searchedCount = useCollectionCount(searched)

const [sort, setSort] = useState<ISort>(null)
const sorted = useSort(searched, sort)

const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const paged = usePage(sorted, page, pageSize)

const selected = useSelection(collection)
const selectedCount = useCollectionCount(selected)

const rows = useRows(paged, selected, columns)

return (
    <table>
        {rows.map(row => (
            <tr>
                {row.cells.map(cell=>(
                    <td>{cell}</td>
                ))}
            <tr>
        ))}
    </table>
)

```
