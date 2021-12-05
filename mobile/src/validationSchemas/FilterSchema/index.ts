 import React from 'react';
 import {Formik, Form, Field} from 'formik';
 import * as Yup from 'yup';

 const FilterSchema = Yup.object().shape({
   ageRange: Yup.object().shape({
     minAge: Yup.number().required(),
     maxAge: Yup.number().required(),
   }),
   sportFilter: Yup.array(
     Yup.object({
       sport: Yup.string().required(),
       filterSelected: Yup.number().required(),
     }).required(),
   ).required(),
   gameLevels: Yup.object().shape({
     gamelevel0: Yup.boolean().required(),
     gamelevel1: Yup.boolean().required(),
     gamelevel2: Yup.boolean().required(),
   }).test('at-least-one-required', 'you check atleast one', value => !!(value.gamelevel0 || value.gamelevel1 || value.gamelevel2)),
 });


export {FilterSchema}
