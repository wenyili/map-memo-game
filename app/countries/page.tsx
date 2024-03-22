'use client'
import React, { useState } from 'react';
import countries from '../assets/country_data.json'

const CountryTable = () => {
    const [selectedImage, setSelectedImage] = useState<string>();
    
    return (
        <>
            <table className="mx-auto w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name (ZH)
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Flag Picture
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Map Picture
                        </th>
                        {['Population', 'GDP', 'GDP Per Capita', 'Capital City', 'ISO Alpha-2', 'ISO Alpha-3', 'Dialing Code'].map((header, index) => (
                            <th key={index} scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                            </th>
                        ))}
                    </tr>
                    
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {countries.map((country) => (
                    <tr key={country.name}>
                        <td className="px-6 py-4 whitespace-nowrap">{country.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{country.name_zh}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img src={country.flag_picture} alt="Flag" className="w-12 h-6" onClick={() => setSelectedImage(country.flag_picture)}/>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <img src={country.map_picture} alt="Map" className="w-12 h-6" onClick={() => setSelectedImage(country.map_picture)} />
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.population}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.gdp}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.gdp_per_capita}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.capital_city}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.iso_alpha_2}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.iso_alpha_3}</td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">{country.dialing_code}</td>
                    </tr>
                    ))}
                </tbody>
            </table>

            {selectedImage && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={() => setSelectedImage(undefined)}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={e => e.stopPropagation()}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-center sm:justify-center">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <img src={selectedImage} alt="Preview" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}

        </>
    );
};

export default CountryTable;
