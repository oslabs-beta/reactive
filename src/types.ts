export type DisposableOptions = {
    canSelectMany: boolean;
    openLabel: string;
    filters: FiltersObject;
}

export type FiltersObject = {
    'Accepted Files': string[]; 
}

export type TreeObject = {
    file: string;
    type: 'class' | 'functional' | null;
    state: string[];
    children: TreeObject[];
}