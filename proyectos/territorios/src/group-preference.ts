export function matchesGroup(label: string, group: string): boolean {
    if (!group)
        return true;
    if (/^(general|todos(?: los grupos)?|congregaci[oó]n)$/i.test(label.trim()))
        return true;
    const groups: string[] = label.match(/\d+/g) || [];
    return groups.includes(group);
}
