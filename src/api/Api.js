const Api = async (param, query = '') => {

    const base_url = import.meta.env.VITE_BASE_URL
    const api_key = import.meta.env.VITE_API_KEY
    const params = param

    const get = await fetch(`${base_url}/${param}?api_key=${api_key}${query}`)
    const results = await get.json()

    return results

}

export default Api