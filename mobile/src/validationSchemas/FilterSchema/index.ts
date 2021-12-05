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
       filterSelected: Yup.boolean().required(),
     }).required(),
   ),
   gameLevels: Yup.object().shape({
     gameLevel0: Yup.boolean().required(),
     gameLevel1: Yup.boolean().required(),
     gameLevel2: Yup.boolean().required(),
   })
   .test('at-least-one-required', 'you check atleast one', value => !!(value.gameLevel0 || value.gameLevel1 || value.gameLevel2)),
 });


export {FilterSchema}
