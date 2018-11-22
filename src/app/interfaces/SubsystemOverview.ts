/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

/**
 * Interface with the fields for fetching a SubsystemOverview.
 */
export interface SubsystemOverview {
    subsystemName: string;
    logs: number;
    userId: string;
    lastLog: string;
    logId: string;
}
