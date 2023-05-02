import React, { useState } from 'react';
import styles from "@/styles/Dashboard.module.css";
import Head from "next/head";
import Link from 'next/link';
import { PopulatedExhibit } from '@/types';
import { AdminNav, ConfirmPopup, CreateExhibitPopup } from '@/components';

export interface DashboardProps {
  initialExhibits: PopulatedExhibit[];
}

