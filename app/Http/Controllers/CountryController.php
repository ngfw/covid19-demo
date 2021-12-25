<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\User;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Find Country for the dropdown
     *
     * @param Request $request
     * @return void
     */
    public function search(Request $request)
    {
        return Country::where('name', 'LIKE', '%' . $request->input('term') . '%')->take(20)->get();
    }

    /**
     * Add user selected country to DB
     *
     * @param Request $request
     * @return void
     */
    public function addCountry(Request $request)
    {
        $country = Country::find($request->id);
        $request->user()
            ->countries()
            ->attach($country->id);
        $request->user()->save();
        return ['status' => 'success'];
    }
    /**
     * Add user selected country to DB
     *
     * @param Request $request
     * @return void
     */
    public function removeCountry(Request $request)
    {
        $country = Country::where('name', $request->name)->firstOrFail();
        $request->user()
            ->countries()
            ->detach($country->id);
        $request->user()->save();
        return ['status' => 'success'];
    }

    public function getUserCountries(Request $request)
    {
        return $request->user()
            ->countries()->get()->pluck('name');
    }
}