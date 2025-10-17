"use client";
import { useState } from "react";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { redirect } from 'next/navigation'
import React from 'react'

export default function SignOut() {

    async function handleSignOut() {
        const { error } = await supabaseBrowser.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            console.log('User signed out successfully.');
            // Optionally, redirect the user or update UI state
            redirect('/')

        }
    }
    return (
        <button className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500 absolute top-10 right-10"
            onClick={handleSignOut}>Sign Out</button>
    )
}
