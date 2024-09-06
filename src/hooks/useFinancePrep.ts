import * as React from 'react'
import { useQuery } from 'react-query'
import { getGeneralData, getProfile } from '../utils/api'

export type CompanyDataType = {
    symbol: string
    name: string
    stockExchange: string
    address: string
    price: number
    currency: string
}

export const useGetCompanyData = (search: string) => {
    const { data: generalData, isLoading: isLoadingGeneralData } = useQuery(
        ['getGeneralData', search],
        () => getGeneralData(search),
        { enabled: !!search }
    )

    const profileQueryString = React.useMemo(() => {
        let str = ''
        generalData?.forEach((item: any) => {
            str += item.symbol + ','
        })
        return str
    }, [generalData])

    const { data: profileData, isLoading: isLoadingProfileData } = useQuery(
        ['getProfile', search],
        () => getProfile(profileQueryString),
        {
            enabled: !!generalData?.length
        }
    )
    console.log({ generalData })
    console.log({ profileData })

    const companyData: CompanyDataType[] = React.useMemo(() => {
        return (
            generalData?.map((item: any) => {
                const { symbol, name, exchangeShortName } = item
                const profile = profileData?.find((element: any) => element.symbol === symbol)
                return {
                    symbol,
                    name,
                    stockExchange: exchangeShortName,
                    address: profile?.address,
                    price: profile?.price,
                    currency: profile?.currency
                }
            }) || []
        )
    }, [generalData, profileData])

    return { companyData, isLoading: isLoadingGeneralData || isLoadingProfileData }
}
